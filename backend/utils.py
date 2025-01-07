def is_correct_format(d):
    # Check if it has exactly 4 key-value pairs
    if len(d) != 4:
        return False

    # Check if all keys are of the correct type and all values are floats
    for key, value in d.items():
        if key not in ["sepal_length", "sepal_width", "petal_length", "petal_width"]:
            return False
        try:
            if float(value) < 0:
                return False
        except ValueError:
            return False

    return True
