namespace SalesAPI.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string Document { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = null!;
        public string UserType { get; set; } = "customer";

        public ICollection<Address> Addresses { get; set; } = new List<Address>();
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    }
}
