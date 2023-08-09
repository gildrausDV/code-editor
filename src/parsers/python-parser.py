import ast
import sys


def parse_python_code(code):
    try:
        parsed = ast.parse(code)
        return parsed
    except SyntaxError as e:
        return e


python_code = sys.argv[1]

parsed_code = parse_python_code(python_code)

if isinstance(parsed_code, SyntaxError):
    print("""
          {
            "status": "Failure",
            "errors": [
                {
                    "description": \"""" + parsed_code.msg + """\",
                    "line": """ + str(parsed_code.lineno) + """
                }
            ]
          }
          """)
else:
    print("""
            {
                "status": "Success"
            }
          """)
    # print(parsed_code)
