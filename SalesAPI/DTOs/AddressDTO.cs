namespace SalesAPI.DTOs
{
    public class AddressDTO
    {
        public int Id { get; set; }
        public required string Street { get; set; }
        public required string Number { get; set; }
        public required string City { get; set; }
        public required string State { get; set; }
        public required string ZipCode { get; set; }
        public int CustomerId { get; set; }
    }

    public class PostPutAddressDTO
    {
        public required string Street { get; set; }
        public required string Number { get; set; }
        public required string City { get; set; }
        public required string State { get; set; }
        public required string ZipCode { get; set; }
        public int CustomerId { get; set; }
    }
}
