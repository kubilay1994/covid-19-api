using corona.db;
using corona.Entities;
using corona.Helpers;
using corona.Models;
using corona.Repositories.Interfaces;
using corona.Services.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Security.Claims;

namespace corona.Services
{


    public class UserService : IUserService
    {

        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _config;

        public UserService(IConfiguration config, IServiceProvider services)
        {
            _config = config;
            _userRepository = services.GetService<IUserRepository>();
        }

        public Task<User> AuthenticateUser(User credentials)
        {
            return _userRepository.GetUser(credentials.Username, credentials.Password);

        }

        public string GenerateJWTToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

            };

            //var expiresIn = Convert.ToDouble(_config["Jwt:ExpiresIn"]);
            var expiresIn = _config.GetSection("Jwt").GetValue<double>("ExpiresIn");

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMilliseconds(expiresIn),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }




}


