import os
working_directory = os.getcwd()

# Change this value
filename = "name.txt"

output_file = "output-" + filename
output_array = []

def read_input() -> None:
    """
    Reads the specified file defined in the "filename" variable and outputs it to "output_array".
    Designed to work with data that is separated onto new lines.
    Modifies the content of the input file to a Typescript-friendly syntax.
    """
    with open(os.path.join(working_directory + "/scripts/input/", filename), "r") as file:
        file_content = file.read()
        file_lines = file_content.splitlines()
        file_length = len(file_lines)
        for (index, line) in enumerate(file_lines):
            if index != file_length - 1:
                output_array.append(f"{line.rstrip()} | ")
            else:
                output_array.append(str(line))

def write_output() -> None:
    """
    Flattens the data inside "output_array" and writes it to a file.
    The output is designed to be copied and pasted directly into a Typescript definitions file as a type value.
    """
    with open(os.path.join(working_directory + "/scripts/output/", output_file), "w") as file:
        file.write(" ".join(output_array))

if (__name__ == "__main__"):
    read_input()
    write_output()