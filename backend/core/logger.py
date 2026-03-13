
"""
Central logging configuration for Codebrix.
"""

import logging


def setup_logger() -> logging.Logger:
    """
    Configure and return the main application logger.
    """

    logger = logging.getLogger("codebrix")

    if logger.handlers:
        return logger

    logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    logger.addHandler(console_handler)

    return logger


# Default shared logger instance
logger = setup_logger()
