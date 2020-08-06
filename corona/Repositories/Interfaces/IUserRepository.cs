using corona.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace corona.Repositories.Interfaces
{
    public interface IUserRepository : IBaseRepository<User>
    {
        public Task<User> GetUser(string username, string password);

    }
}
