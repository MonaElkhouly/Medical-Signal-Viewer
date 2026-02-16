from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.services import medical_service as ms

router = APIRouter(
    prefix="/signals/medical",
    tags=["Medical Signals"]
)

@router.get("/{filename}/metadata")
def metadata(filename: str):
    try:
        return ms.get_metadata(filename)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")


@router.get("/{filename}/data")
def signal_data(
    filename: str,
    start: int = Query(0, ge=0),
    end: int = Query(100, ge=0)
):
    try:
        return ms.get_slice(filename, start, end)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")


@router.get("/{filename}/channels")
def channels(filename: str):
    try:
        return ms.get_channels(filename)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")


@router.get("/{filename}/window")
def signal_window(
    filename: str,
    start_time: float = Query(..., ge=0),
    window: float = Query(5.0, gt=0),
    sampling_rate: float = Query(..., gt=0),
    channels: Optional[str] = None
):
    try:
        try:
            channel_ids = (
                [int(c) for c in channels.split(",")]
                if channels else None
            )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Channels must be comma-separated integers"
            )

        return ms.get_time_slice(
            filename,
            start_time,
            window,
            sampling_rate,
            channel_ids
        )

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")


@router.get("/{filename}/xor")
def xor_signal(
    filename: str,
    viewer_time: float = Query(..., gt=0),
    sampling_rate: float = Query(..., gt=0)
):
    try:
        return ms.xor_chunks(filename, viewer_time, sampling_rate)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")


@router.get("/{filename}/polar")
def polar_view(
    filename: str,
    viewer_time: float = Query(10.0, gt=0),
    sampling_rate: float = Query(..., gt=0),
    cumulative: bool = Query(False),
    channels: Optional[str] = None
):
    try:
        try:
            channel_indices = (
                [int(c) for c in channels.split(",")]
                if channels else None
            )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Channels must be comma-separated integers"
            )

        return ms.polar_signal(
            filename,
            viewer_time,
            sampling_rate,
            cumulative,
            channel_indices
        )

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")


@router.get("/{filename}/recurrence")
def recurrence_view(
    filename: str,
    chX: int = Query(..., ge=0),
    chY: int = Query(..., ge=0),
    viewer_time: Optional[float] = Query(None, gt=0),
    sampling_rate: Optional[float] = Query(None, gt=0)
):
    if viewer_time is not None and sampling_rate is None:
        raise HTTPException(
            status_code=400,
            detail="sampling_rate is required when viewer_time is provided"
        )

    try:
        return ms.recurrence_graph(
            filename,
            chX,
            chY,
            viewer_time,
            sampling_rate
        )

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
