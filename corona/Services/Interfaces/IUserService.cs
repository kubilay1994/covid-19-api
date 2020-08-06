using corona.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace corona.Services.Interfaces
{
    public interface IUserService
    {
        public Task<User> AuthenticateUser(User credentials);
        public string GenerateJWTToken(User user);


    }
}
