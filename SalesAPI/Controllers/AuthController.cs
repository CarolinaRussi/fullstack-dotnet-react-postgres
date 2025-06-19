using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SalesAPI.Data;
using SalesAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SalesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SalesDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(SalesDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email);
            if (customer == null)
                return Unauthorized("Usuário ou senha inválidos.");

            bool validPassword = BCrypt.Net.BCrypt.Verify(dto.Password, customer.PasswordHash);
            if (!validPassword)
                return Unauthorized("Usuário ou senha inválidos.");

            var token = GenerateJwtToken(customer);
            Response.Headers["Authorization"] = $"Bearer {token}";

            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(Customer customer)
        {
            var jwtSettings = _configuration.GetSection("Jwt");

            var keyString = jwtSettings["Key"] ?? throw new Exception("Jwt:Key não encontrada");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expireMin = jwtSettings["ExpireMinutes"] ?? throw new Exception("Jwt:ExpireMinutes não encontrada");

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, customer.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, customer.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(double.Parse(expireMin)),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginDTO
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
