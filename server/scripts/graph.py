# generate_chart.py
import matplotlib.pyplot as plt
import sys
import json
from datetime import datetime

def generate_chart(data, resolution, output_file):
    x_labels = []
    y_values = []

    for ts, value in data.items():
        # Convertir el timestamp en una fecha
        ts = int(ts)
        x_labels.append(datetime.fromtimestamp(ts / 1000).strftime('%d-%m-%Y %H:%M'))
        y_values.append(float(value))

    plt.figure(figsize=(10, 5))
    plt.bar(x_labels, y_values, color='blue')
    plt.xticks(rotation=45, ha='right')
    plt.xlabel('Time')
    plt.ylabel('Consumption')
    plt.title('Consumption over Time')
    plt.tight_layout()

    plt.savefig(output_file)

if __name__ == '__main__':
    # Leer argumentos desde la línea de comandos
    input_data = sys.argv[1]
    resolution = int(sys.argv[2])
    output_file = sys.argv[3]

    # Convertir el JSON de entrada a un diccionario
    data = json.loads(input_data)

    # Generar la gráfica
    generate_chart(data, resolution, output_file)
