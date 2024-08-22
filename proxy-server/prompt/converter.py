import json

def format_text_for_json(text):

    return text.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')

def convert_text_to_json(text_file_path, json_file_path):

    try:
        # Read the content of the text file
        with open(text_file_path, 'r', encoding='utf-8') as text_file:
            text_content = text_file.read()
        
        # Format the content to be JSON-safe
        formatted_text = format_text_for_json(text_content)
        
        # Create a JSON object
        json_data = {
            "prompt": formatted_text
        }
        
        # Write the JSON data to a file
        with open(json_file_path, 'w', encoding='utf-8') as json_file:
            json.dump(json_data, json_file, indent=4)
        
        print(f"Successfully converted {text_file_path} to {json_file_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

text_file_path = 'instructions.txt'  # Replace with the path to your text file
json_file_path = 'systemPrompt.json'  # Replace with the path to your output JSON file

convert_text_to_json(text_file_path, json_file_path)