import matplotlib.pyplot as plt
import sys
import json
from datetime import datetime, timedelta

def generate_chart(color, unit, data, end_date, chart_name, resolution):
    """
    Generates a bar chart from the provided data and saves it as an image file.
    Args:
        color (str): The color of the bars in the chart.
        unit (str): The unit of measurement for the y-axis.
        data (str): A JSON string containing the data points. Each data point should have a 'value' and a 'ts' (timestamp in milliseconds).
        end_date (str): The end date for the chart in the format "dd/mm/YYYY".
        chart_name (str): The name of the file where the chart will be saved.
        resolution (int): The resolution in milliseconds for the x-axis intervals.
    Returns:
        str: The path to the saved chart image, or an error message if an exception occurs.
    Raises:
        ValueError: If the input data is not in the expected format.
        TypeError: If the input types are not as expected.
    """
    try:
        end_dt = datetime.strptime(end_date, "%d/%m/%Y")

        resolution_ms = int(resolution)
        resolution_td = timedelta(milliseconds=resolution_ms)

        x = []
        y = []

        parsed_data = json.loads(data)
        data_dates = set()

     
        for i in parsed_data:
            current_value = float(i['value'])
            dt = datetime.fromtimestamp(i["ts"] / 1000)  
            date_str = dt.strftime("%d/%m")
            x.append(date_str)
            y.append(current_value)
            data_dates.add(dt)
            
        parsed_data.sort(key=lambda i: i["ts"])
        first_data_date = datetime.fromtimestamp(parsed_data[0]["ts"] / 1000)
        last_data_date = datetime.fromtimestamp(parsed_data[-1]["ts"] / 1000)
        
        current_dt = last_data_date
        while current_dt <= end_dt:
            if current_dt not in data_dates:
                date_str = current_dt.strftime("%d/%m")
                x.append(date_str)  # Agregar al final
                y.append(0)  
            current_dt += resolution_td

        sorted_data = sorted(zip(x, y), key=lambda data: datetime.strptime(data[0], "%d/%m"))
        x, y = zip(*sorted_data)

        plt.figure(figsize=(16, 8))
        plt.bar(x, y, color=color)
        
        plt.ylabel(f'Total {unit}', fontsize=20)
        num_labels = len(x)
        step = 1
        if len(x) < 7:
            step = 1
        if resolution_ms <= 3600000:
            step = 7
        plt.xticks(range(0, num_labels, step), x[::step], fontsize=18)
        plt.yticks(fontsize=18)
        plt.grid(True, which='both', axis='both', linestyle='--', linewidth=0.7, color='lightgray', alpha=0.5)

        plt.gca().spines['top'].set_visible(False)
        plt.gca().spines['right'].set_visible(False)
        plt.gca().spines['left'].set_visible(False)
        plt.gca().spines['bottom'].set_visible(False)

        plt.tight_layout()

        plt.savefig(chart_name, bbox_inches='tight', pad_inches=0)

        # Devolver el path de la imagen
        return chart_name
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    color = sys.argv[1]
    unit = sys.argv[2]
    data = sys.argv[3]
    end_date = sys.argv[4]
    chart_name = sys.argv[5]
    resolution = sys.argv[6]
    
    generate_chart(color, unit, data, end_date, chart_name, resolution)
