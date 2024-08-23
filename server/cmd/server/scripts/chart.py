import matplotlib.pyplot as plt
import sys
import json
from datetime import datetime, timedelta

def generar_grafica(color, unit, data, start_date, end_date):
    # Datos de ejemplo para la gráfica (30 categorías)
    x = []
    y = []
    parsed_data = []



    # Convertir start_date y end_date a objetos datetime
    start_dt = datetime.strptime(start_date, "%d/%m/%Y")
    end_dt = datetime.strptime(end_date, "%d/%m/%Y")

    # Crear un set para las fechas que ya tienen datos
    data_dates = set()

    for i in json.loads(data):
        current_value = float(i['value'])
        dt = datetime.fromtimestamp(i["ts"] / 1000)
        date_str = dt.strftime("%d/%m")
        y.append(current_value)
        x.append(date_str)
        data_dates.add(dt.date())
        

    # Rellenar los días faltantes con 0
    current_dt = start_dt
    while current_dt <= end_dt:
        if current_dt not in data_dates:
            date_str = current_dt.strftime("%d/%m")
            x.append(date_str)
            y.append(0)
            parsed_data.append({"consumption": 0, "ts": date_str})
        current_dt += timedelta(days=1)

    # Ordenar x, y, y parsed_data por fecha
    #pasar a milisegundos y ordenar
    sorted_data = sorted(zip(x, y, parsed_data), key=lambda data: datetime.strptime(data[0], "%d/%m"))
    x, y, parsed_data = zip(*sorted_data)

    # Crear la figura y la gráfica de barras con un tamaño ajustado (responsive)
    plt.figure(figsize=(16, 8))
    plt.bar(x, y, color=color)

    # Agregar título y etiquetas a los ejes
    plt.ylabel(f'Total {unit}', fontsize=20)

    # Mostrar solo algunos labels en el eje X
    num_labels = len(x)
    step = 4 # Mostrar un label cada 3 categorías (puedes ajustar este valor)
    if len(x) < 7:
        step = 1
    plt.xticks(range(0, num_labels, step), x[::step], fontsize=18)
    plt.yticks(fontsize=18)

    # Agregar cuadrícula con color gris claro y casi transparente
    plt.grid(True, which='both', axis='both', linestyle='--', linewidth=0.7, color='lightgray', alpha=0.5)

    # Quitar bordes del área de la gráfica
    plt.gca().spines['top'].set_visible(False)
    plt.gca().spines['right'].set_visible(False)
    plt.gca().spines['left'].set_visible(False)
    plt.gca().spines['bottom'].set_visible(False)

    # Ajustar la gráfica para que se vea mejor en diferentes tamaños
    plt.tight_layout()

    # Path de la imagen
    image_path = 'grafica.png'
    
    # Guardar la gráfica como imagen
    plt.savefig(image_path, bbox_inches='tight', pad_inches=0)
    
    # Devolver el path de la imagen y los datos procesados
    return image_path

if __name__ == '__main__':
    # Pasar el color de las barras y la unidad como parámetros
    color = sys.argv[1]
    unit = sys.argv[2]
    data = sys.argv[3]
    start_date = sys.argv[4]
    end_date = sys.argv[5]
    print(generar_grafica(color, unit, data, start_date, end_date))

