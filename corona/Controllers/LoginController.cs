using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using corona.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using corona.Services;
using corona.Helpers;
using corona.Entities;
using corona.Services.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace corona.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IUserService _userService;

        public LoginController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] User credentials)
        {
            User user = await _userService.AuthenticateUser(credentials);

            if (user != null)
            {
                var tokenString = _userService.GenerateJWTToken(user);
                return Ok(new
                {
                    user = new
                    {
                        username = user.Username
                    },
                    token = tokenString
                });
            }

            return Unauthorized();


        }

    }
}
