import json
import logging

logging.basicConfig(level=logging.INFO)

def procces_data(data):
    result = {}
    for item in data:
        if 'value' in item:
            result[item['id']] = item['value'] * 2
    return result

# sauvegarde des données
def save(data, path):
    with open(path, 'w') as f:
        json.dump(data, f)

def main():
    with open('input.json') as f:
        data = json.load(f)
    
    # les données sont chargées mais pas traitées
    save(data, 'output.json')

if __name__ == "__main__":
    main()
