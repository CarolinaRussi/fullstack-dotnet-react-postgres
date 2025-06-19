namespace SalesAPI.DTOs
{
     public class SaleDTO
    {
        public int Id { get; set; }
        public CustomerDTO? Customer { get; set; }
        public decimal TotalValue { get; set; }
        public DateTime SaleDate { get; set; }
        public List<SaleItemDTO> SaleItems { get; set; } = new();
    }

    public class SaleItemDTO
    {
        public int Id { get; set; }
        public ProductDTO Product { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

     public class PostPutSaleDTO
    {
        public int CustomerId { get; set; }
        public List<PostPutSaleItemDTO> SaleItems { get; set; } = new();
    }

    public class PostPutSaleItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
