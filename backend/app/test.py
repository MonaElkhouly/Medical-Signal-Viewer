import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from app.services import medical_service as ms

result = ms.xor_chunks(
    filename="example.csv",
    viewer_time=10.0,      # 10-second chunks
    sampling_rate=250.0,   # 250 Hz
)

print(result["num_chunks"])      # e.g., 7
print(result["chunk_size_rows"]) # e.g., 2500
print(result["xor_overlay"])     # normalized overlay values for plotting
