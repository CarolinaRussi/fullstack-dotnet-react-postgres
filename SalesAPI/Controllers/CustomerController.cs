using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesAPI.Data;
using SalesAPI.Models;
using SalesAPI.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace SalesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly SalesDbContext _context;

        public CustomerController(SalesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDTO>>> GetCustomers()
        {
            var customers = await _context.Customers
                .Include(c => c.Addresses)
                .ToListAsync();

            var customerDTOs = customers.Select(c => new CustomerDTO
            {
                Id = c.Id,
                Document = c.Document,
                Name = c.Name,
                Email = c.Email,
                Telephone = c.Telephone,
                Addresses = c.Addresses.Select(a => new AddressDTO
                {
                    Id = a.Id,
                    Street = a.Street,
                    Number = a.Number,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode
                }).ToList()
            });

            return Ok(customerDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDTO>> GetCustomer(int id)

        {
            var customer = await _context.Customers
                .Include(c => c.Addresses)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null) return NotFound();

            var customerDTO = new CustomerDTO
            {
                Id = customer.Id,
                Document = customer.Document,
                Name = customer.Name,
                Email = customer.Email,
                Telephone = customer.Telephone,
                Addresses = customer.Addresses.Select(a => new AddressDTO
                {
                    Id = a.Id,
                    Street = a.Street,
                    Number = a.Number,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode
                }).ToList()
            };

            return Ok(customerDTO);

        }

        [HttpGet("me")]
        public async Task<ActionResult<CustomerDTO>> GetCurrentCustomer()
        {
            var customerIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(customerIdClaim)) return Unauthorized();

            if (!int.TryParse(customerIdClaim, out var customerId)) return Unauthorized();

            var customer = await _context.Customers
                .Include(c => c.Addresses)
                .FirstOrDefaultAsync(c => c.Id == customerId);

            if (customer == null) return NotFound();

            var customerDTO = new CustomerDTO
            {
                Id = customer.Id,
                Document = customer.Document,
                Name = customer.Name,
                Email = customer.Email,
                Telephone = customer.Telephone,
                Addresses = customer.Addresses.Select(a => new AddressDTO
                {
                    Id = a.Id,
                    Street = a.Street,
                    Number = a.Number,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode,
                    CustomerId = a.CustomerId
                }).ToList()
            };

            return Ok(customerDTO);
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<CustomerDTO>> CreateCustomer(PostCustomerDTO dto)
        {
            bool documentExists = await _context.Customers.AnyAsync(c => c.Document == dto.Document);
            if (documentExists)
                return Conflict(new { error = "Documento já cadastrado." });

            bool emailExists = await _context.Customers.AnyAsync(c => c.Email == dto.Email);
            if (emailExists)
                return Conflict(new { error = "Email já está em uso." });

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var customer = new Customer
            {
                Document     = dto.Document,
                Name         = dto.Name,
                Email        = dto.Email,
                Telephone    = dto.Telephone,
                PasswordHash = hashedPassword,
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var customerDTO = new CustomerDTO
            {
                Id        = customer.Id,
                Document  = customer.Document,
                Name      = customer.Name,
                Email     = customer.Email,
                Telephone = customer.Telephone,
                Addresses = new List<AddressDTO>()
            };

            return CreatedAtAction(
                nameof(GetCustomer),
                new { id = customer.Id },
                customerDTO
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, PutCustomerDTO dto)
        {
            var customer = await _context.Customers
                .Include(c => c.Addresses)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null) return NotFound();

            if (dto.Name != null)
                customer.Name = dto.Name;

            if (dto.Email != null)
                customer.Email = dto.Email;

            if (dto.Telephone != null)
                customer.Telephone = dto.Telephone;

            if (dto.Password != null)
            {
                customer.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            if (dto.Addresses != null)
            {
                _context.Addresses.RemoveRange(customer.Addresses);
                customer.Addresses = dto.Addresses.Select(a => new Address
                {
                    Street = a.Street,
                    Number = a.Number,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode,
                    CustomerId = customer.Id
                }).ToList();
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Customers.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null) return NotFound();

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
