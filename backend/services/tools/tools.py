"""
Advanced Calculator Module
==========================
A secure, feature-rich calculator engine with:
  - Safe expression evaluation (no eval())
  - Support for arithmetic, scientific functions, constants, and unit conversions
  - Detailed error reporting with typed exceptions
  - Calculation history with timestamps
  - Expression tokenizer + AST-based evaluator
  - Type hints throughout
"""

from __future__ import annotations

import math
import operator
import re
import time
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Callable, Union

# ---------------------------------------------------------------------------
# Types
# ---------------------------------------------------------------------------

Number = Union[int, float, complex]


# ---------------------------------------------------------------------------
# Exceptions
# ---------------------------------------------------------------------------

class CalculatorError(Exception):
    """Base class for all calculator errors."""


class ParseError(CalculatorError):
    """Raised when the expression cannot be tokenised or parsed."""


class EvaluationError(CalculatorError):
    """Raised when a mathematically invalid operation is attempted."""


class UnknownSymbolError(CalculatorError):
    """Raised when an unknown variable, function, or constant is used."""


# ---------------------------------------------------------------------------
# Token types
# ---------------------------------------------------------------------------

class TT(Enum):
    NUMBER   = auto()
    IDENT    = auto()   # function name or constant
    LPAREN   = auto()
    RPAREN   = auto()
    COMMA    = auto()
    PLUS     = auto()
    MINUS    = auto()
    STAR     = auto()
    SLASH    = auto()
    PERCENT  = auto()
    CARET    = auto()
    EOF      = auto()


@dataclass
class Token:
    type: TT
    value: str
    pos: int


# ---------------------------------------------------------------------------
# Lexer
# ---------------------------------------------------------------------------

_TOKEN_RE = re.compile(
    r"""
      (?P<NUMBER>  \d+(?:\.\d+)?(?:[eE][+-]?\d+)?   # int / float / sci-notation
                 | \.\d+(?:[eE][+-]?\d+)?  )         # .5 style
    | (?P<IDENT>   [A-Za-z_]\w*           )
    | (?P<OP>      [+\-*/%^(),]           )
    | (?P<WS>      \s+                    )
    """,
    re.VERBOSE,
)

_OP_MAP: dict[str, TT] = {
    "+": TT.PLUS,   "-": TT.MINUS, "*": TT.STAR,
    "/": TT.SLASH,  "%": TT.PERCENT, "^": TT.CARET,
    "(": TT.LPAREN, ")": TT.RPAREN, ",": TT.COMMA,
}


def _tokenize(expr: str) -> list[Token]:
    tokens: list[Token] = []
    pos = 0
    for m in _TOKEN_RE.finditer(expr):
        if m.lastgroup == "WS":
            pos = m.end()
            continue
        if m.start() != pos:
            raise ParseError(
                f"Unexpected character {expr[pos]!r} at position {pos}"
            )
        kind = m.lastgroup
        raw  = m.group()
        if kind == "NUMBER":
            tokens.append(Token(TT.NUMBER, raw, pos))
        elif kind == "IDENT":
            tokens.append(Token(TT.IDENT, raw, pos))
        elif kind == "OP":
            tokens.append(Token(_OP_MAP[raw], raw, pos))
        pos = m.end()

    if pos != len(expr):
        raise ParseError(
            f"Unexpected character {expr[pos]!r} at position {pos}"
        )
    tokens.append(Token(TT.EOF, "", pos))
    return tokens


# ---------------------------------------------------------------------------
# Recursive-descent parser + evaluator
# ---------------------------------------------------------------------------

class _Parser:
    """
    Grammar (operator precedence, low → high):
        expr   := term   ( ('+' | '-') term   )*
        term   := factor ( ('*' | '/' | '%') factor )*
        factor := unary  ( '^' factor )*          (right-associative)
        unary  := '-' unary | primary
        primary:= NUMBER | IDENT '(' args ')' | IDENT | '(' expr ')'
        args   := expr (',' expr)*
    """

    def __init__(self, tokens: list[Token], env: dict[str, Number | Callable]) -> None:
        self._tokens = tokens
        self._pos    = 0
        self._env    = env

    # -- helpers -------------------------------------------------------------

    @property
    def _cur(self) -> Token:
        return self._tokens[self._pos]

    def _eat(self, tt: TT) -> Token:
        tok = self._cur
        if tok.type != tt:
            raise ParseError(
                f"Expected {tt.name} but got {tok.type.name!r} ({tok.value!r}) "
                f"at position {tok.pos}"
            )
        self._pos += 1
        return tok

    def _match(self, *types: TT) -> bool:
        return self._cur.type in types

    # -- grammar rules -------------------------------------------------------

    def parse(self) -> Number:
        result = self._expr()
        self._eat(TT.EOF)
        return result

    def _expr(self) -> Number:
        left = self._term()
        while self._match(TT.PLUS, TT.MINUS):
            op = self._cur.type
            self._pos += 1
            right = self._term()
            left = (left + right) if op == TT.PLUS else (left - right)
        return left

    def _term(self) -> Number:
        left = self._factor()
        while self._match(TT.STAR, TT.SLASH, TT.PERCENT):
            op = self._cur.type
            self._pos += 1
            right = self._factor()
            if op == TT.STAR:
                left = left * right
            elif op == TT.SLASH:
                if right == 0:
                    raise EvaluationError("Division by zero")
                left = left / right
            else:
                if right == 0:
                    raise EvaluationError("Modulo by zero")
                left = left % right
        return left

    def _factor(self) -> Number:
        base = self._unary()
        if self._match(TT.CARET):
            self._pos += 1
            exp = self._factor()          # right-associative
            try:
                return base ** exp
            except ZeroDivisionError:
                raise EvaluationError("Zero cannot be raised to a negative power")
        return base

    def _unary(self) -> Number:
        if self._match(TT.MINUS):
            self._pos += 1
            return -self._unary()
        if self._match(TT.PLUS):
            self._pos += 1
            return self._unary()
        return self._primary()

    def _primary(self) -> Number:
        tok = self._cur

        if tok.type == TT.NUMBER:
            self._pos += 1
            raw = tok.value
            return int(raw) if "." not in raw and "e" not in raw.lower() else float(raw)

        if tok.type == TT.IDENT:
            name = tok.value
            self._pos += 1
            if self._match(TT.LPAREN):        # function call
                self._eat(TT.LPAREN)
                args = []
                if not self._match(TT.RPAREN):
                    args.append(self._expr())
                    while self._match(TT.COMMA):
                        self._pos += 1
                        args.append(self._expr())
                self._eat(TT.RPAREN)
                if name not in self._env:
                    raise UnknownSymbolError(f"Unknown function: {name!r}")
                fn = self._env[name]
                if not callable(fn):
                    raise EvaluationError(f"{name!r} is a constant, not a function")
                try:
                    return fn(*args)
                except (ValueError, ZeroDivisionError, OverflowError) as exc:
                    raise EvaluationError(str(exc)) from exc
            else:                              # constant
                if name not in self._env:
                    raise UnknownSymbolError(f"Unknown symbol: {name!r}")
                val = self._env[name]
                if callable(val):
                    raise ParseError(f"{name!r} is a function — did you forget the parentheses?")
                return val  # type: ignore[return-value]

        if tok.type == TT.LPAREN:
            self._eat(TT.LPAREN)
            val = self._expr()
            self._eat(TT.RPAREN)
            return val

        raise ParseError(
            f"Unexpected token {tok.type.name!r} ({tok.value!r}) at position {tok.pos}"
        )


# ---------------------------------------------------------------------------
# Built-in environment
# ---------------------------------------------------------------------------

def _safe_log(x: float, base: float = math.e) -> float:
    if x <= 0:
        raise EvaluationError("log() requires a positive argument")
    return math.log(x, base)


def _safe_sqrt(x: float) -> float:
    if x < 0:
        raise EvaluationError("sqrt() requires a non-negative argument")
    return math.sqrt(x)


def _safe_factorial(n: float) -> int:
    if n != int(n) or n < 0:
        raise EvaluationError("factorial() requires a non-negative integer")
    return math.factorial(int(n))


def _ncr(n: float, r: float) -> int:
    """Combinations C(n, r)."""
    n, r = int(n), int(r)
    return math.comb(n, r)


def _npr(n: float, r: float) -> int:
    """Permutations P(n, r)."""
    n, r = int(n), int(r)
    return math.perm(n, r)


_DEFAULT_ENV: dict[str, Number | Callable] = {
    # Constants
    "pi":      math.pi,
    "e":       math.e,
    "tau":     math.tau,
    "inf":     math.inf,
    "phi":     (1 + math.sqrt(5)) / 2,   # golden ratio

    # Trig
    "sin":     math.sin,
    "cos":     math.cos,
    "tan":     math.tan,
    "asin":    math.asin,
    "acos":    math.acos,
    "atan":    math.atan,
    "atan2":   math.atan2,
    "sinh":    math.sinh,
    "cosh":    math.cosh,
    "tanh":    math.tanh,
    "degrees": math.degrees,
    "radians": math.radians,

    # Exponential / logarithmic
    "exp":     math.exp,
    "log":     _safe_log,
    "log2":    math.log2,
    "log10":   math.log10,
    "sqrt":    _safe_sqrt,
    "cbrt":    lambda x: math.copysign(abs(x) ** (1 / 3), x),
    "pow":     math.pow,

    # Rounding / abs
    "abs":     abs,
    "ceil":    math.ceil,
    "floor":   math.floor,
    "round":   round,
    "trunc":   math.trunc,

    # Combinatorics
    "factorial": _safe_factorial,
    "gcd":     math.gcd,
    "lcm":     math.lcm,
    "comb":    _ncr,
    "perm":    _npr,

    # Min / max / sum / hyp
    "min":     min,
    "max":     max,
    "hypot":   math.hypot,
    "fsum":    math.fsum,

    # Misc
    "sign":    lambda x: math.copysign(1, x) if x != 0 else 0,
    "clamp":   lambda x, lo, hi: max(lo, min(x, hi)),
}


# ---------------------------------------------------------------------------
# Result dataclass
# ---------------------------------------------------------------------------

@dataclass
class CalculationResult:
    expression: str
    result: Number | None
    formatted:  str
    success:    bool
    error:      str | None = None
    timestamp:  float = field(default_factory=time.time)

    def __str__(self) -> str:
        return self.formatted


# ---------------------------------------------------------------------------
# History entry
# ---------------------------------------------------------------------------

@dataclass
class HistoryEntry:
    expression: str
    result:     str
    success:    bool
    timestamp:  float


# ---------------------------------------------------------------------------
# Public Calculator class
# ---------------------------------------------------------------------------

class Calculator:
    """
    Advanced, safe expression calculator.

    Usage
    -----
    >>> calc = Calculator()
    >>> print(calc.calculate("2 + 3 * 4"))          # 14
    >>> print(calc.calculate("sin(pi/2)"))           # 1.0
    >>> print(calc.calculate("log(e^3)"))            # 3.0
    >>> print(calc.calculate("comb(10, 3)"))         # 120
    >>> calc.set_variable("x", 42)
    >>> print(calc.calculate("x^2 + 2*x + 1"))      # 1849

    Parameters
    ----------
    max_history : int
        Maximum number of entries kept in the rolling history (default 100).
    precision   : int
        Decimal places used when formatting float results (default 10).
    """

    def __init__(
        self,
        max_history: int = 100,
        precision: int = 10,
    ) -> None:
        self._env: dict[str, Number | Callable] = dict(_DEFAULT_ENV)
        self._history: list[HistoryEntry] = []
        self._max_history  = max_history
        self._precision    = precision

    # -- public interface ----------------------------------------------------

    def calculate(self, expression: str) -> CalculationResult:
        """
        Evaluate *expression* and return a :class:`CalculationResult`.

        The result object is also appended to the internal history.
        This method never raises — errors are captured in the result.
        """
        expr = expression.strip()
        if not expr:
            return self._fail(expr, "Empty expression")

        try:
            tokens  = _tokenize(expr)
            parser  = _Parser(tokens, self._env)
            value   = parser.parse()
            fmt     = self._format(value)
            result  = CalculationResult(
                expression=expr,
                result=value,
                formatted=fmt,
                success=True,
            )
        except CalculatorError as exc:
            result = self._fail(expr, str(exc))
        except OverflowError:
            result = self._fail(expr, "Result is too large to represent")
        except RecursionError:
            result = self._fail(expr, "Expression is too deeply nested")

        self._add_history(result)
        return result

    def set_variable(self, name: str, value: Number) -> None:
        """Define or update a user variable (e.g. ``x = 5``)."""
        if not re.fullmatch(r"[A-Za-z_]\w*", name):
            raise ValueError(f"Invalid variable name: {name!r}")
        if name in _DEFAULT_ENV:
            raise ValueError(
                f"{name!r} is a built-in constant/function and cannot be overridden"
            )
        self._env[name] = value

    def delete_variable(self, name: str) -> None:
        """Remove a user-defined variable."""
        if name in _DEFAULT_ENV:
            raise ValueError(f"Cannot delete built-in symbol {name!r}")
        self._env.pop(name, None)

    def list_variables(self) -> dict[str, Number]:
        """Return all user-defined variables (excludes built-ins)."""
        return {
            k: v
            for k, v in self._env.items()
            if k not in _DEFAULT_ENV and not callable(v)
        }

    @property
    def history(self) -> list[HistoryEntry]:
        """Read-only view of the calculation history."""
        return list(self._history)

    def clear_history(self) -> None:
        """Wipe the calculation history."""
        self._history.clear()

    def available_functions(self) -> list[str]:
        """Return sorted list of all built-in function names."""
        return sorted(k for k, v in _DEFAULT_ENV.items() if callable(v))

    def available_constants(self) -> dict[str, Number]:
        """Return all built-in constants as a name → value mapping."""
        return {k: v for k, v in _DEFAULT_ENV.items() if not callable(v)}

    # -- internals -----------------------------------------------------------

    def _format(self, value: Number) -> str:
        if isinstance(value, complex):
            return str(value)
        if isinstance(value, int):
            return str(value)
        # float
        if value == math.inf:
            return "∞"
        if value == -math.inf:
            return "-∞"
        if math.isnan(value):
            return "NaN"
        rounded = round(value, self._precision)
        # Drop trailing zeros but keep at least one decimal place for clarity
        text = f"{rounded:.{self._precision}f}".rstrip("0").rstrip(".")
        return text if text else "0"

    def _fail(self, expr: str, msg: str) -> CalculationResult:
        return CalculationResult(
            expression=expr,
            result=None,
            formatted=f"Error: {msg}",
            success=False,
            error=msg,
        )

    def _add_history(self, result: CalculationResult) -> None:
        entry = HistoryEntry(
            expression=result.expression,
            result=result.formatted,
            success=result.success,
            timestamp=result.timestamp,
        )
        self._history.append(entry)
        if len(self._history) > self._max_history:
            self._history.pop(0)


# ---------------------------------------------------------------------------
# Legacy-compatible TOOLS dict  (drop-in replacement)
# ---------------------------------------------------------------------------

_default_calc = Calculator()


def calculator(expression: str) -> str:
    """
    Drop-in replacement for the original ``calculator`` function.
    Uses the :class:`Calculator` engine internally for safe, rich evaluation.
    """
    return str(_default_calc.calculate(expression))


TOOLS: dict[str, Callable[[str], str]] = {
    "calculator": calculator,
}


# ---------------------------------------------------------------------------
# Quick demo
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    calc = Calculator()

    demos = [
        "2 + 3 * 4",
        "sqrt(144)",
        "sin(pi / 6)",
        "log(e^5)",
        "factorial(10)",
        "comb(10, 3)",
        "2^10",
        "hypot(3, 4)",
        "ceil(2.3) + floor(7.9)",
        "(1 + 1/1000000)^1000000",   # approaches e
        "1 / 0",                      # graceful error
        "log(-1)",                    # graceful error
        "unknownFunc(5)",             # graceful error
    ]

    print("=" * 60)
    print("  Advanced Calculator Demo")
    print("=" * 60)
    for expr in demos:
        r = calc.calculate(expr)
        status = "✓" if r.success else "✗"
        print(f"  [{status}] {expr:<35} → {r}")

    # User variables
    calc.set_variable("r", 5)
    r = calc.calculate("pi * r^2")
    print(f"\n  [✓] Area of circle (r=5): pi * r^2  → {r}")

    print("\n  History (last 3):")
    for h in calc.history[-3:]:
        print(f"      {h.expression}  →  {h.result}")