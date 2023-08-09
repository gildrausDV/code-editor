import sys
from pycparser import c_parser


cpp_code = sys.argv[1]


def parse_cpp_code(code):
    try:
        parser = c_parser.CParser()
        parsed = parser.parse(code)
        return parsed
    except Exception as e:
        return e


parsed_code = parse_cpp_code(cpp_code)


if isinstance(parsed_code, Exception):
    print("Syntax Error:", parsed_code)
else:
    print("Successfully parsed C++ code:")
    print(parsed_code)
