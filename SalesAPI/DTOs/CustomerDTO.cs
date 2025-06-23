namespace SalesAPI.DTOs
{
    public class CustomerDTO
    {
        public int Id { get; set; }
        public required string Document { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Telephone { get; set; }
        public required string UserType { get; set; }

        public List<AddressDTO> Addresses { get; set; } = new();
    }

    public class PostCustomerDTO
    {
        public required string Document { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Telephone { get; set; }
        public required string Password { get; set; }
        public required string UserType { get; set; }
    }

    public class PutCustomerDTO
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Telephone { get; set; }
        public string? Password { get; set; }

        public List<PostPutAddressDTO>? Addresses { get; set; }
    }
}
