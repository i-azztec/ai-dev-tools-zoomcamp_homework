export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  language: 'javascript' | 'python';
  starterCode: string;
}

export const taskLibrary: TaskTemplate[] = [
  {
    id: 'sort-array',
    title: 'Сортировка массива',
    description: 'Напишите функцию, которая принимает массив чисел и возвращает отсортированный массив по возрастанию.\n\nПример:\nInput: [5, 2, 8, 1, 9]\nOutput: [1, 2, 5, 8, 9]',
    difficulty: 'easy',
    category: 'Массивы',
    language: 'javascript',
    starterCode: 'function sortArray(arr) {\n  // Ваше решение\n  \n}\n\n// Тест\nconsole.log(sortArray([5, 2, 8, 1, 9]));',
  },
  {
    id: 'reverse-string',
    title: 'Переворот строки',
    description: 'Напишите функцию, которая переворачивает строку.\n\nПример:\nInput: "hello"\nOutput: "olleh"',
    difficulty: 'easy',
    category: 'Строки',
    language: 'javascript',
    starterCode: 'function reverseString(str) {\n  // Ваше решение\n  \n}\n\n// Тест\nconsole.log(reverseString("hello"));',
  },
  {
    id: 'fibonacci',
    title: 'Последовательность Фибоначчи',
    description: 'Напишите функцию, которая возвращает n-ное число Фибоначчи.\n\nПоследовательность: 0, 1, 1, 2, 3, 5, 8, 13...\n\nПример:\nInput: 6\nOutput: 8',
    difficulty: 'medium',
    category: 'Алгоритмы',
    language: 'javascript',
    starterCode: 'function fibonacci(n) {\n  // Ваше решение\n  \n}\n\n// Тест\nconsole.log(fibonacci(6));',
  },
  {
    id: 'two-sum',
    title: 'Two Sum',
    description: 'Дан массив чисел и целевое число. Найдите индексы двух чисел, сумма которых равна целевому числу.\n\nПример:\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nОбъяснение: nums[0] + nums[1] = 2 + 7 = 9',
    difficulty: 'medium',
    category: 'Массивы',
    language: 'javascript',
    starterCode: 'function twoSum(nums, target) {\n  // Ваше решение\n  \n}\n\n// Тест\nconsole.log(twoSum([2, 7, 11, 15], 9));',
  },
  {
    id: 'is-palindrome',
    title: 'Проверка палиндрома',
    description: 'Напишите функцию, которая проверяет, является ли строка палиндромом (читается одинаково в обе стороны).\n\nПример:\nInput: "racecar"\nOutput: true',
    difficulty: 'easy',
    category: 'Строки',
    language: 'javascript',
    starterCode: 'function isPalindrome(str) {\n  // Ваше решение\n  \n}\n\n// Тест\nconsole.log(isPalindrome("racecar"));',
  },
  {
    id: 'binary-search',
    title: 'Бинарный поиск',
    description: 'Реализуйте бинарный поиск в отсортированном массиве. Верните индекс искомого элемента или -1, если элемент не найден.\n\nПример:\nInput: arr = [1, 3, 5, 7, 9], target = 5\nOutput: 2',
    difficulty: 'medium',
    category: 'Алгоритмы',
    language: 'javascript',
    starterCode: 'function binarySearch(arr, target) {\n  // Ваше решение\n  \n}\n\n// Тест\nconsole.log(binarySearch([1, 3, 5, 7, 9], 5));',
  },
  {
    id: 'merge-sorted-arrays',
    title: 'Объединение отсортированных массивов',
    description: 'Объедините два отсортированных массива в один отсортированный массив.\n\nПример:\nInput: arr1 = [1, 3, 5], arr2 = [2, 4, 6]\nOutput: [1, 2, 3, 4, 5, 6]',
    difficulty: 'medium',
    category: 'Массивы',
    language: 'javascript',
    starterCode: 'function mergeSortedArrays(arr1, arr2) {\n  // Ваше решение\n  \n}\n\n// Тест\nconsole.log(mergeSortedArrays([1, 3, 5], [2, 4, 6]));',
  },
  {
    id: 'find-duplicates',
    title: 'Поиск дубликатов',
    description: 'Найдите все дубликаты в массиве.\n\nПример:\nInput: [1, 2, 3, 2, 4, 5, 3]\nOutput: [2, 3]',
    difficulty: 'easy',
    category: 'Массивы',
    language: 'javascript',
    starterCode: 'function findDuplicates(arr) {\n  // Ваше решение\n  \n}\n\n// Тест\nconsole.log(findDuplicates([1, 2, 3, 2, 4, 5, 3]));',
  },
  // Python версии
  {
    id: 'sort-array-py',
    title: 'Сортировка массива',
    description: 'Напишите функцию, которая принимает список чисел и возвращает отсортированный список по возрастанию.\n\nПример:\nInput: [5, 2, 8, 1, 9]\nOutput: [1, 2, 5, 8, 9]',
    difficulty: 'easy',
    category: 'Массивы',
    language: 'python',
    starterCode: 'def sort_array(arr):\n    # Ваше решение\n    pass\n\n# Тест\nprint(sort_array([5, 2, 8, 1, 9]))',
  },
  {
    id: 'fibonacci-py',
    title: 'Последовательность Фибоначчи',
    description: 'Напишите функцию, которая возвращает n-ное число Фибоначчи.\n\nПоследовательность: 0, 1, 1, 2, 3, 5, 8, 13...\n\nПример:\nInput: 6\nOutput: 8',
    difficulty: 'medium',
    category: 'Алгоритмы',
    language: 'python',
    starterCode: 'def fibonacci(n):\n    # Ваше решение\n    pass\n\n# Тест\nprint(fibonacci(6))',
  },
];
