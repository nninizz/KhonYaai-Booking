import importlib


def test_cancellation_package_is_importable():
    # รองรับ REQ-FN-DRAFT-CAN-05 และยืนยันโครง package ตาม BR-CAN-DRAFT-09
    cancellation = importlib.import_module("backend.app.cancellation")

    assert cancellation.__file__ is not None
