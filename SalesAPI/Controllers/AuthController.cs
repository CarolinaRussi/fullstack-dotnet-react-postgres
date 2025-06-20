using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SalesAPI.Data;
using SalesAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SalesAPI.Constants;

namespace SalesAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SalesDbContext _context;

        public AuthController(SalesDbContext context, IConfiguration configuration)
        {
            _context = context;
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
            var keyString = Environment.GetEnvironmentVariable("JWT_KEY") ?? throw new Exception("JWT_KEY não encontrada");
            var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? throw new Exception("JWT_ISSUER não encontrada");
            var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? throw new Exception("JWT_AUDIENCE não encontrada");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, customer.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, customer.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(CustomClaimTypes.UserType, customer.UserType)

            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginDTO
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
