namespace my.company;

entity Products {
  key ProductID       : Integer;
      ProductName     : String(100);
      SupplierID      : Integer;
      CategoryID      : Integer;
      QuantityPerUnit : String(50);
      UnitPrice       : Decimal(10, 4);
      UnitsInStock    : Integer;
      UnitsOnOrder    : Integer;
      ReorderLevel    : Integer;
}
