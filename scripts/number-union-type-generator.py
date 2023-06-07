import os
working_directory = os.getcwd()

# Change this value 
limit = 249

output_array = []

def generate_numbers() -> None:
    """
    Generates numbers within the range specified in the "limit" variable and outputs them to "output_array".
    """
    for number in range(1, limit + 1):
            if number != limit:
                output_array.append(f"{number} |")
            else:
                output_array.append(str(number))

def write_output() -> None:
    """
    Flattens the data inside "output_array" and writes it to a file.
    The output is designed to be copied and pasted directly into a Typescript definitions file as a type value.
    """
    with open(os.path.join(working_directory + "/scripts/output/", "output-number.txt"), "w") as file:
        file.write(" ".join(output_array))

if (__name__ == "__main__"):
    generate_numbers()
    write_output()