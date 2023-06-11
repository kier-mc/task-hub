import os
working_directory = os.getcwd()

# Change these values
filename1 = "name.txt"
filename2 = "iso-code.txt"

output_file = "output-hashmap-" + filename1 +"-" +filename2
output_array = []

def read_input() -> None:
    """
    Reads the specified file defined in the "filename" variable and outputs it to "output_array" as a key/value pair.
    The pair consists of string data (read from the file) and a numerical index (coerced to a string value), beginning with "1".
    Designed to work with data that is separated onto new lines.
    Alter the value (int/str or str/int) of "hashmap_order" to change the order of the key/value pairs.
    """
    with open(os.path.join(working_directory + "/scripts/input/", filename1), "r") as file1, open(os.path.join(working_directory + "/scripts/input/", filename2), "r") as file2:
        file1_content = file1.read()
        file2_content = file2.read()
        file1_lines = file1_content.splitlines()
        file2_lines = file2_content.splitlines()
        file1_length = len(file1_lines)
        file2_length = len(file2_lines)
        if file1_length != file2_length:
            raise Exception("File lengths must be equal")
        for (index, line) in enumerate(file1_lines, 1):
            if index != file1_length:
                output_array.append(f"{line.rstrip()}: {file2_lines[index-1].rstrip()},")
            else:
                output_array.append(f"{line.rstrip()}: {file2_lines[index-1].rstrip()}")

def write_output() -> None:
    """
    Flattens the data inside "output_array" and writes it to a file.
    The output is designed to be copied and pasted directly into a Typescript hashmap as key/value pairs.
    """
    with open(os.path.join(working_directory + "/scripts/output/", output_file), "w") as file:
        file.write(" ".join(output_array))

if (__name__ == "__main__"):
    read_input()
    write_output()
