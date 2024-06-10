import sys
import json
import os
import warnings
from transformers import FSMTForConditionalGeneration, FSMTTokenizer, AutoTokenizer, T5ForConditionalGeneration
import transformers
from contextlib import redirect_stdout, redirect_stderr
import io

# Подавление предупреждений и установка уровня логировани
warnings.filterwarnings("ignore")
transformers.logging.set_verbosity_error()

# Получение абсолютного пути к директории скрипта
script_dir = os.path.dirname(os.path.abspath(__file__))

# Модель для перевода русского текста на английский
CKPT_translator = os.path.join(script_dir, "model/wmt19-ru-en")
tokenizer_translator = FSMTTokenizer.from_pretrained(CKPT_translator)
model_translator = FSMTForConditionalGeneration.from_pretrained(
    CKPT_translator)

# Модель для перевода текста на английском в SQL
CKPT = os.path.join(script_dir, "model/T5-LM-Large-text2sql-spider")
tokenizer_sql = AutoTokenizer.from_pretrained(CKPT)
model_sql = T5ForConditionalGeneration.from_pretrained(CKPT)


def translate_to_english(text):
    input_ids = tokenizer_translator.encode(text, return_tensors="pt")
    outputs = model_translator.generate(input_ids)
    return tokenizer_translator.decode(outputs[0], skip_special_tokens=True)


def translate_to_sql(text):
    inputs = tokenizer_sql(text, return_tensors="pt")
    output = model_sql.generate(**inputs, max_length=256)
    return tokenizer_sql.decode(output[0], skip_special_tokens=True)


def load_json_data(json_file):
    try:
        with open(json_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return data
    except FileNotFoundError:
        print("JSON file not found, proceeding without JSON data.")
        return {}


def make_question(question, columns):
    headers = "header table : " + " | ".join(columns)
    return "translate to SQL: " + question + "\n\n" + headers


if __name__ == "__main__":
    try:
        # Перенаправление stdout и stderr в буфер
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            input_text = sys.argv[1] if len(sys.argv) > 1 else ""
            script_dir = os.path.dirname(os.path.realpath(__file__))
            json_file_path = os.path.join(script_dir, "db.json")

            json_data = load_json_data(json_file_path)

            # Получение названий колонок из JSON данных
            columns = [col['Name'] for table in json_data.get(
                'Tables', []) for col in table.get('Columns', [])]

            translated_text = translate_to_english(input_text)
            question_with_columns = make_question(translated_text, columns)
            sql_query = translate_to_sql(question_with_columns)

        # Очистка буфера, чтобы удалить все предупреждения
        f.close()

        # Вывод окончательного SQL запроса
        print(sql_query)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
