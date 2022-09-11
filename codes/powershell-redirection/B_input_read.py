import time

# Read 10 lines from standard input
accumulated_input = ""
start_time = time.time()
for _ in range(10):
  accumulated_input += input() + "\n"
end_time = time.time()
print("Time taken", end_time - start_time)
print(accumulated_input)