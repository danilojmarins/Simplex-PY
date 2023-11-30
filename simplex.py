class Simplex:
    
    def __init__(self):
        self.table = []

    # Adiciona função objetivo à tabela
    def set_objective_function(self, fo: list):
        self.table.append(fo)

    # Adiciona uma restrição à tabela
    def add_restrictions(self, st: list):
        self.table.append(st)

    # Retorna o índice da coluna pivô
    def get_entry_column(self) -> int:
        pivot_column = min(self.table[0])
        index = self.table[0].index(pivot_column)

        return index

    def get_exiting_line(self, entry_column: int) -> int:
        results = {}
        for line in range(len(self.table)):
            if line > 0:
                if self.table[line][entry_column] > 0:
                    result = self.table[line][-1] / self.table[line][entry_column]
                    results[line] = result

        index = min(results, key=results.get)

        return index
    
    def calculate_new_line(self, line: list, entry_column: int, pivot_line: list) -> list:
        pivot = line[entry_column] * -1

        result_line = [value * pivot for value in pivot_line]
        new_line = []

        for i in range(len(result_line)):
            sum = result_line[i] + line[i]
            new_line.append(sum)

        return new_line
    
    def calculate_new_pivot_line(self, entry_column: int, exiting_line: int) -> list:
        line = self.table[exiting_line]
        pivot = line[entry_column]
        new_pivot_line = [value / pivot for value in line]

        return new_pivot_line
    
    def some_is_negative(self) -> bool:
        negatives = list(filter(lambda x: x < 0, self.table[0]))
        return True if len(negatives) > 0 else False
    
    def proccess_table(self):
        entry_column = self.get_entry_column()
        first_exiting_line = self.get_exiting_line(entry_column)
        pivot_line = self.calculate_new_pivot_line(entry_column, first_exiting_line)

        self.table[first_exiting_line] = pivot_line

        table_copy = self.table.copy()

        index = 0
        while index < len(self.table):
            if index != first_exiting_line:
                line = table_copy[index]
                new_line = self.calculate_new_line(line, entry_column, pivot_line)
                self.table[index] = new_line
            index += 1
    
    def solve(self):
        self.proccess_table()

        while self.some_is_negative():
            self.proccess_table()
        
        self.show_table()

    def show_table(self):
        for i in range(len(self.table)):
            for j in range(len(self.table[0])):
                print(f"{self.table[i][j]}\t", end="")
            print()