import pytest

from backend.app.cancellation.policy import (
    CancellationPolicyDecision,
    DepositOutcome,
    evaluate_cancellation_policy,
)


@pytest.mark.parametrize(
    ("minutes_remaining", "expected"),
    [
        (
            44,
            CancellationPolicyDecision(
                cancellation_allowed=False,
                warning_confirmation_required=False,
                deposit_outcome=DepositOutcome.NOT_SPECIFIED,
                refund_window_minutes=None,
            ),
        ),
        (
            45,
            CancellationPolicyDecision(
                cancellation_allowed=True,
                warning_confirmation_required=True,
                deposit_outcome=DepositOutcome.RETAINED_BY_PLATFORM,
                refund_window_minutes=None,
            ),
        ),
        (
            119,
            CancellationPolicyDecision(
                cancellation_allowed=True,
                warning_confirmation_required=True,
                deposit_outcome=DepositOutcome.RETAINED_BY_PLATFORM,
                refund_window_minutes=None,
            ),
        ),
        (
            120,
            CancellationPolicyDecision(
                cancellation_allowed=True,
                warning_confirmation_required=False,
                deposit_outcome=DepositOutcome.FULL_REFUND,
                refund_window_minutes=120,
            ),
        ),
    ],
)
def test_AC_06_DRAFT_05_cancellation_boundaries(
    minutes_remaining: int,
    expected: CancellationPolicyDecision,
) -> None:
    # รองรับ REQ-FN-DRAFT-CAN-05 และตรวจ BR-CAN-DRAFT-09 / AC-06-DRAFT-05
    assert evaluate_cancellation_policy(minutes_remaining) == expected


@pytest.mark.parametrize("minutes_remaining", [True, 45.0, "45", None])
def test_AC_06_DRAFT_05_rejects_invalid_minutes(
    minutes_remaining: object,
) -> None:
    # รองรับ REQ-FN-DRAFT-CAN-05 โดยไม่ยอมรับค่าเวลาที่ไม่ใช่จำนวนเต็ม
    with pytest.raises(TypeError, match="minutes_remaining must be an integer"):
        evaluate_cancellation_policy(minutes_remaining)  # type: ignore[arg-type]
