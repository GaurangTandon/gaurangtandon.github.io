#include <iostream>

int main() {
  // setup faster io
  std::ios_base::sync_with_stdio(false);
  std::cin.tie(NULL);

  int count; std::cin >> count;
  long long int sum = 0;
  for (int i = 0; i < count; i++) {
    int inp; std::cin >> inp;
    sum += inp;
  }
  std::cout << sum << std::endl;
  return 0;
}