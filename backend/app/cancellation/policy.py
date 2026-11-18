from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


# รองรับ REQ-FN-DRAFT-CAN-05 โดยแสดงผลมัดจำตาม BR-CAN-DRAFT-09
class DepositOutcome(str, Enum):
    FULL_REFUND = "full_refund"
    RETAINED_BY_PLATFORM = "retained_by_platform"
    NOT_SPECIFIED = "not_specified"


# รองรับ REQ-FN-DRAFT-CAN-05 โดยเก็บผลประเมิน BR-CAN-DRAFT-09 แบบ immutable
@dataclass(frozen=True)
class CancellationPolicyDecision:
    cancellation_allowed: bool
    warning_confirmation_required: bool
    deposit_outcome: DepositOutcome
    refund_window_minutes: int | None


# รองรับ REQ-FN-DRAFT-CAN-05 และ BR-CAN-DRAFT-09 โดยไม่มี side effects
def evaluate_cancellation_policy(
    minutes_remaining: int,
) -> CancellationPolicyDecision:
    """ประเมินสิทธิ์และผลเชิงนโยบาย โดยไม่ดำเนินการยกเลิกหรือคืนเงินจริง."""
    if isinstance(minutes_remaining, bool) or not isinstance(minutes_remaining, int):
        raise TypeError("minutes_remaining must be an integer")

    if minutes_remaining < 45:
        return CancellationPolicyDecision(
            cancellation_allowed=False,
            warning_confirmation_required=False,
            deposit_outcome=DepositOutcome.NOT_SPECIFIED,
            refund_window_minutes=None,
        )

    if minutes_remaining < 120:
        return CancellationPolicyDecision(
            cancellation_allowed=True,
            warning_confirmation_required=True,
            deposit_outcome=DepositOutcome.RETAINED_BY_PLATFORM,
            refund_window_minutes=None,
        )

    return CancellationPolicyDecision(
        cancellation_allowed=True,
        warning_confirmation_required=False,
        deposit_outcome=DepositOutcome.FULL_REFUND,
        refund_window_minutes=120,
    )
