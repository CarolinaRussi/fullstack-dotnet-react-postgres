namespace SalesAPI.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public string ImageUrl { get; set; } = string.Empty;
        public string Size { get; set; } = string.Empty;
    }
}
