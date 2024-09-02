import matplotlib.pyplot as plt
import sys
import json
from datetime import datetime, timedelta

def generar_grafica(color, unit, data, start_date, end_date, chart_name, resolution):
    try:
        # Convertir start_date y end_date a objetos datetime
        start_dt = datetime.strptime(start_date, "%d/%m/%Y")
        end_dt = datetime.strptime(end_date, "%d/%m/%Y")

        # Convertir la resolución de milisegundos a un objeto timedelta
        resolution_ms = int(resolution)
        resolution_td = timedelta(milliseconds=resolution_ms)

        # Listas para fechas (x) y valores (y)
        x = []
        y = []

        # Convertir datos JSON y almacenar fechas con datos
        parsed_data = json.loads(data)
        data_dates = set()

        # Crear listas iniciales a partir de los datos proporcionados
        for i in parsed_data:
            current_value = float(i['value'])
            dt = datetime.fromtimestamp(i["ts"] / 1000)  # Convertir timestamp a datetime
            date_str = dt.strftime("%d/%m")
            x.append(date_str)
            y.append(current_value)
            data_dates.add(dt)

        # Ordenar los datos para obtener la primera y última fecha de la data
        parsed_data.sort(key=lambda i: i["ts"])
        first_data_date = datetime.fromtimestamp(parsed_data[0]["ts"] / 1000)
        last_data_date = datetime.fromtimestamp(parsed_data[-1]["ts"] / 1000)

        # Asegurarse de que se complete exactamente en los límites
        # Rellenar días faltantes desde el primer dato hacia start_date
        current_dt = start_dt
        while current_dt <= first_data_date:
            if current_dt not in data_dates:
                x.insert(0, date_str)  # Insertar al principio
                y.insert(0, 0)  # Insertar un 0 al principio
            current_dt += resolution_td

        # Rellenar días faltantes desde el último dato hacia end_date
        current_dt = last_data_date
        while current_dt <= end_dt:
            if current_dt not in data_dates:
                date_str = current_dt.strftime("%d/%m")
                x.append(date_str)  # Agregar al final
                y.append(0)  # Agregar un 0 al final
            current_dt += resolution_td

        # Ordenar x, y por fecha
        sorted_data = sorted(zip(x, y), key=lambda data: datetime.strptime(data[0], "%d/%m"))
        x, y = zip(*sorted_data)

        # Crear la figura y la gráfica de barras con un tamaño ajustado
        plt.figure(figsize=(16, 8))
        plt.bar(x, y, color=color)

        # Configuración de etiquetas y títulos
        plt.ylabel(f'Total {unit}', fontsize=20)
        num_labels = len(x)
        step = 1
        if len(x) < 7:
            step = 1
        # if resolution are in hours
        if resolution_ms <= 3600000:
            step = 6
        plt.xticks(range(0, num_labels, step), x[::step], fontsize=18)
        plt.yticks(fontsize=18)
        plt.grid(True, which='both', axis='both', linestyle='--', linewidth=0.7, color='lightgray', alpha=0.5)

        # Ajuste de bordes de la gráfica
        plt.gca().spines['top'].set_visible(False)
        plt.gca().spines['right'].set_visible(False)
        plt.gca().spines['left'].set_visible(False)
        plt.gca().spines['bottom'].set_visible(False)

        # Ajuste del diseño para mejor visualización
        plt.tight_layout()

        # Guardar la gráfica como imagen
        plt.savefig(chart_name, bbox_inches='tight', pad_inches=0)

        # Devolver el path de la imagen
        return chart_name
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    # Pasar el color de las barras, la unidad, los datos y las fechas como parámetros
    color = sys.argv[1]
    unit = sys.argv[2]
    data = sys.argv[3]
    start_date = sys.argv[4]
    end_date = sys.argv[5]
    chart_name = sys.argv[6]
    resolution = sys.argv[7]
    
    print(generar_grafica(color, unit, data, start_date, end_date, chart_name, resolution))
