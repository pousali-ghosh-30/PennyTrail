import CardInfo from '@/app/components/CardInfo';

const BudgetList = ({ budgets }) => {
  // Group budgets by month here like you're already doing...

  const totalAmount = budgets.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const count = budgets.length;

  return (
    <div>
      {/* Example static group */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">2025-05</h3>

          {/* Inline summary and card info */}
          <div className="flex items-center gap-6">
            <div className="text-gray-500">
              Total Budgets: {count} | Total Amount: ₹{totalAmount}
            </div>
            <CardInfo budgetList={budgets} />
          </div>
        </div>

        {/* Your existing list rendering logic below */}
        {/* Example: <BudgetItem budget={...} /> */}
      </div>
    </div>
  );
};

export default BudgetList;