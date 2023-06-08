import os
working_directory = os.getcwd()

# Change these values
filename = "name.txt"
# Set to "int/str" or "str/int" to set the key/value pair order
# Any other values will throw an exception
hashmap_order = "int/str"

output_file = "output-hashmap-" + filename
output_array = []

def read_input(key_value_order: str) -> None:
    """
    Reads the specified file defined in the "filename" variable and outputs it to "output_array" as a key/value pair.
    The pair consists of string data (read from the file) and a numerical index (coerced to a string value), beginning with "1".
    Designed to work with data that is separated onto new lines.
    Alter the value (int/str or str/int) of "hashmap_order" to change the order of the key/value pairs.
    """
    with open(os.path.join(working_directory + "/scripts/input/", filename), "r") as file:
        file_content = file.read()
        file_lines = file_content.splitlines()
        file_length = len(file_lines)
        for (index, line) in enumerate(file_lines, 1):
            match key_value_order:
                case "int/str":
                    if index != file_length:
                        output_array.append(f"{index}: {line.rstrip()},")
                    else:
                        output_array.append(f"{index}: {line.rstrip()}")
                case "str/int":
                    if index != file_length:                        
                        output_array.append(f"{line.rstrip()}: {index},")
                    else:                       
                        output_array.append(f"{line.rstrip()}: {index}")
                case _:
                    raise ValueError("Incorrect argument supplied. Please read the comments at the top of the file for correct usage.")

def write_output() -> None:
    """
    Flattens the data inside "output_array" and writes it to a file.
    The output is designed to be copied and pasted directly into a Typescript hashmap as key/value pairs.
    """
    with open(os.path.join(working_directory + "/scripts/output/", output_file), "w") as file:
        file.write(" ".join(output_array))

if (__name__ == "__main__"):
    read_input(hashmap_order)
    write_output()
