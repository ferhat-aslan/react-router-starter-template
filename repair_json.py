import json
import os

files = [
    'app/i18n/tr.json',
    'app/i18n/pt.json',
    'app/i18n/it.json',
    'app/i18n/ru.json',
    'app/i18n/es.json',
    'app/i18n/ar.json'
]

for file_path in files:
    abs_path = os.path.abspath(file_path)
    if not os.path.exists(abs_path):
        print(f"Skipping {file_path}, not found.")
        continue
    
    try:
        with open(abs_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Simple cleanup: replace multiple spaces with single space if it looks like corruption
        # But be careful not to break indentation. 
        # A safer way is to try parsing as JSON if possible.
        
        # If it's valid JSON, just re-dump it pretty
        try:
            data = json.loads(content)
            with open(abs_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"Repaired {file_path} (Valid JSON logic)")
        except json.JSONDecodeError:
            # If not valid, try a more aggressive regex cleanup for extra spaces within values
            print(f"Attempting regex repair for {file_path}...")
            import re
            # Only remove excessive spaces (more than 10) likely caused by corruption
            cleaned = re.sub(r' {10,}', ' ', content)
            try:
                data = json.loads(cleaned)
                with open(abs_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"Repaired {file_path} (Regex + JSON logic)")
            except:
                print(f"Failed to repair {file_path} automatically.")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
