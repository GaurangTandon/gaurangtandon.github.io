with open('input.txt', 'r') as f:
  is_first = True
  count = 0
  sum = 0
  for line in f:
    if is_first: 
      count = int(line.strip())
    elif count > 0:
      count -= 1
      sum += int(line.strip())
  print(sum)