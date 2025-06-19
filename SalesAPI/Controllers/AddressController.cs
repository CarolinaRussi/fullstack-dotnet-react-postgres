using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesAPI.Data;
using SalesAPI.DTOs;
using SalesAPI.Models;
using Microsoft.AspNetCore.Authorization;


namespace SalesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AddressController : ControllerBase
    {
        private readonly SalesDbContext _context;

        public AddressController(SalesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressDTO>>> GetAll()
        {
            var addresses = await _context.Addresses
                .Select(a => new AddressDTO
                {
                    Id = a.Id,
                    Street = a.Street,
                    Number = a.Number,
                    City = a.City,
                    State = a.State,
                    ZipCode = a.ZipCode,
                    CustomerId = a.CustomerId
                })
                .ToListAsync();

            return Ok(addresses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AddressDTO>> GetById(int id)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null) return NotFound();

            var dto = new AddressDTO
            {
                Id = address.Id,
                Street = address.Street,
                Number = address.Number,
                City = address.City,
                State = address.State,
                ZipCode = address.ZipCode,
                CustomerId = address.CustomerId
            };

            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<AddressDTO>> Create(PostPutAddressDTO dto)
        {
            var customer = await _context.Customers.FindAsync(dto.CustomerId);
            if (customer == null) return BadRequest("Cliente não encontrado.");

            var address = new Address
            {
                Street = dto.Street,
                Number = dto.Number,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                CustomerId = dto.CustomerId
            };

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            var result = new AddressDTO
            {
                Id = address.Id,
                Street = address.Street,
                Number = address.Number,
                City = address.City,
                State = address.State,
                ZipCode = address.ZipCode,
                CustomerId = address.CustomerId
            };

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, PostPutAddressDTO dto)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null) return NotFound();

            address.Street = dto.Street;
            address.Number = dto.Number;
            address.City = dto.City;
            address.State = dto.State;
            address.ZipCode = dto.ZipCode;
            address.CustomerId = dto.CustomerId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null) return NotFound();

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
