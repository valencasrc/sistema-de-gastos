$(document).ready(function () {
  let salary = 0;
  let expenses = [];
  let goal = ''; // Armazena o objetivo
  let savedGoal = localStorage.getItem('goal'); // Recupera o objetivo armazenado

  function loadFromLocalStorage() {
      const savedSalary = localStorage.getItem('salary');
      const savedExpenses = localStorage.getItem('expenses');

      if (savedSalary) {
          salary = parseFloat(savedSalary);
          $('#salary').val(salary);
      }

      if (savedExpenses) {
          expenses = JSON.parse(savedExpenses);
      }

      if (savedGoal) {
          goal = savedGoal;
          $('#goal-display').show();
          $('#goal-text').text(goal);
          updateGoalStatus();
      }

      renderExpenses();
      updateRemainingBalance();
  }

  function saveToLocalStorage() {
      localStorage.setItem('salary', salary);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      localStorage.setItem('goal', goal);
  }

  function updateRemainingBalance() {
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);
      const remainingBalance = salary - totalExpenses;
      $('#remaining-balance').text(`R$ ${remainingBalance.toFixed(2)}`);
      updateGoalStatus();
  }

  function updateGoalStatus() {
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.value, 0);
      const remainingBalance = salary - totalExpenses;

      if (goal) {
          $('#goal-status').text(
              remainingBalance >= 0
                  ? `Você está no caminho certo! Saldo: R$ ${remainingBalance.toFixed(2)}`
                  : `Faltam R$ ${(Math.abs(remainingBalance)).toFixed(2)} para atingir o objetivo`
          );
      }
  }

  function renderExpenses() {
      const $expensesList = $('#expenses');
      $expensesList.empty();
      expenses.forEach((expense, index) => {
          $expensesList.append(`
              <li class="list-group-item d-flex justify-content-between align-items-center">
                  ${expense.name} - R$ ${expense.value.toFixed(2)}
                  <button class="btn btn-danger btn-sm remove-expense" data-index="${index}">Remover</button>
              </li>
          `);
      });
  }

  function addExpense(name, value) {
      expenses.push({ name, value });
      renderExpenses();
      updateRemainingBalance();
      saveToLocalStorage();
  }

  $(document).on('click', '.remove-expense', function () {
      const index = $(this).data('index');
      expenses.splice(index, 1);
      renderExpenses();
      updateRemainingBalance();
      saveToLocalStorage();
  });

  $('#set-salary').click(function () {
      salary = parseFloat($('#salary').val()) || 0;
      updateRemainingBalance();
      saveToLocalStorage();
  });

  $('#add-expense').click(function () {
      const name = $('#expense-name').val().trim();
      const value = parseFloat($('#expense-value').val()) || 0;

      if (name && value > 0) {
          addExpense(name, value);
          $('#expense-name').val('');
          $('#expense-value').val('');
      }
  });

  $('#set-goal').click(function () {
      goal = $('#goal').val().trim();
      if (goal) {
          $('#goal-display').show();
          $('#goal-text').text(goal);
          saveToLocalStorage();
      }
  });

  loadFromLocalStorage();
});
