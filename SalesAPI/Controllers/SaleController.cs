using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalesAPI.Data;
using SalesAPI.DTOs;
using SalesAPI.Models;
using Microsoft.AspNetCore.Authorization;


namespace SalesAPI.Controllers
{
    [ApiController]
    [Route("api/sale")]
    [Authorize]
    public class SaleController : ControllerBase
    {
        private readonly SalesDbContext _context;

        public SaleController(SalesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDTO>>> GetSales()
        {
            var sales = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Product)
                .ToListAsync();

            var salesDto = sales.Select(sale => new SaleDTO
            {
                Id = sale.Id,
                Customer = sale.Customer == null ? null : new CustomerDTO
                {
                    Id = sale.Customer.Id,
                    Document = sale.Customer.Document,
                    Name = sale.Customer.Name,
                    Email = sale.Customer.Email,
                    Telephone = sale.Customer.Telephone,
                    UserType = sale.Customer.UserType,
                },
                TotalValue = sale.TotalValue,
                SaleDate = sale.SaleDate,
                SaleItems = sale.SaleItems.Select(saleItem => new SaleItemDTO
                {
                    Id = saleItem.Id,
                    Product = new ProductDTO
                    {
                        Id = saleItem.Product.Id,
                        Code = saleItem.Product.Code,
                        Name = saleItem.Product.Name,
                        Price = saleItem.Product.Price
                    },
                    Quantity = saleItem.Quantity,
                    UnitPrice = saleItem.UnitPrice
                }).ToList()
            }).ToList();

            return Ok(salesDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDTO>> GetSale(int id)
        {
            var sale = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Product)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale == null) return NotFound();

            var saleDto = new SaleDTO
            {
                Id = sale.Id,
                Customer = sale.Customer == null ? null : new CustomerDTO
                {
                    Id = sale.Customer.Id,
                    Document = sale.Customer.Document,
                    Name = sale.Customer.Name,
                    Email = sale.Customer.Email,
                    Telephone = sale.Customer.Telephone,
                    UserType = sale.Customer.UserType,
                },
                TotalValue = sale.TotalValue,
                SaleDate = sale.SaleDate,
                SaleItems = sale.SaleItems.Select(saleItem => new SaleItemDTO
                {
                    Id = saleItem.Id,
                    Product = new ProductDTO
                    {
                        Id = saleItem.Product.Id,
                        Code = saleItem.Product.Code,
                        Name = saleItem.Product.Name,
                        Price = saleItem.Product.Price
                    },
                    Quantity = saleItem.Quantity,
                    UnitPrice = saleItem.UnitPrice
                }).ToList()
            };

            return Ok(saleDto);
        }

        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<SaleDTO>>> GetSalesByCustomer(int customerId)
        {
            var sales = await _context.Sales
                .Where(s => s.CustomerId == customerId)
                .Include(s => s.Customer)
                .Include(s => s.SaleItems)
                    .ThenInclude(si => si.Product)
                .ToListAsync();

            var saleDtos = sales.Select(sale => new SaleDTO
            {
                Id = sale.Id,
                Customer = sale.Customer == null ? null : new CustomerDTO
                {
                    Id = sale.Customer.Id,
                    Document = sale.Customer.Document,
                    Name = sale.Customer.Name,
                    Email = sale.Customer.Email,
                    Telephone = sale.Customer.Telephone,
                    UserType = sale.Customer.UserType,
                },
                TotalValue = sale.TotalValue,
                SaleDate = sale.SaleDate,
                SaleItems = sale.SaleItems.Select(saleItem => new SaleItemDTO
                {
                    Id = saleItem.Id,
                    Product = new ProductDTO
                    {
                        Id = saleItem.Product.Id,
                        Code = saleItem.Product.Code,
                        Name = saleItem.Product.Name,
                        Price = saleItem.Product.Price
                    },
                    Quantity = saleItem.Quantity,
                    UnitPrice = saleItem.UnitPrice
                }).ToList()
            });

            return Ok(saleDtos);
        }

        [HttpPost]
        public async Task<ActionResult<SaleDTO>> CreateSale(PostPutSaleDTO dto)
        {
            if (dto.SaleItems == null || dto.SaleItems.Count == 0)
                return BadRequest("A venda deve conter pelo menos um item.");

            var customer = await _context.Customers.FindAsync(dto.CustomerId);
            if (customer == null)
                return BadRequest("Cliente não encontrado.");

            var sale = new Sale
            {
                CustomerId = dto.CustomerId,
                SaleDate = DateTime.UtcNow,
                SaleItems = new List<SaleItem>()
            };

            decimal total = 0m;

            foreach (var itemDto in dto.SaleItems)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null)
                    return BadRequest($"Produto com ID {itemDto.ProductId} não encontrado.");

                var saleItem = new SaleItem
                {
                    ProductId = product.Id,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price
                };

                sale.SaleItems.Add(saleItem);
                total += saleItem.Quantity * saleItem.UnitPrice;
            }

            sale.TotalValue = total;

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            var createdSaleDto = new SaleDTO
            {
                Id = sale.Id,
                Customer = new CustomerDTO
                {
                    Id = customer.Id,
                    Document = customer.Document,
                    Name = customer.Name,
                    Email = customer.Email,
                    Telephone = customer.Telephone,
                    UserType = customer.UserType,
                },
                TotalValue = sale.TotalValue,
                SaleDate = sale.SaleDate,
                SaleItems = sale.SaleItems.Select(saleItem => new SaleItemDTO
                {
                    Id = saleItem.Id,
                    Product = new ProductDTO
                    {
                        Id = saleItem.ProductId,
                        Code = _context.Products.Find(saleItem.ProductId)?.Code ?? "",
                        Name = _context.Products.Find(saleItem.ProductId)?.Name ?? "",
                        Price = saleItem.UnitPrice
                    },
                    Quantity = saleItem.Quantity,
                    UnitPrice = saleItem.UnitPrice
                }).ToList()
            };

            return CreatedAtAction(nameof(GetSale), new { id = sale.Id }, createdSaleDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSale(int id, PostPutSaleDTO dto)
        {
            var sale = await _context.Sales
                .Include(s => s.SaleItems)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale == null) return NotFound();

            var customer = await _context.Customers.FindAsync(dto.CustomerId);
            if (customer == null)
                return BadRequest("Cliente não encontrado.");

            _context.SaleItems.RemoveRange(sale.SaleItems);

            sale.SaleItems = new List<SaleItem>();
            decimal total = 0m;

            foreach (var itemDto in dto.SaleItems)
            {
                var product = await _context.Products.FindAsync(itemDto.ProductId);
                if (product == null)
                    return BadRequest($"Produto com ID {itemDto.ProductId} não encontrado.");

                var saleItem = new SaleItem
                {
                    ProductId = product.Id,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.Price
                };

                sale.SaleItems.Add(saleItem);
                total += saleItem.Quantity * saleItem.UnitPrice;
            }

            sale.CustomerId = dto.CustomerId;
            sale.TotalValue = total;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            var sale = await _context.Sales
                .Include(s => s.SaleItems)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale == null) return NotFound();

            _context.SaleItems.RemoveRange(sale.SaleItems);
            _context.Sales.Remove(sale);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
