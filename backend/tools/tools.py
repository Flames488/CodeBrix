
import datetime

def get_time():
    return str(datetime.datetime.utcnow())

TOOLS = {
    "time": get_time
}
