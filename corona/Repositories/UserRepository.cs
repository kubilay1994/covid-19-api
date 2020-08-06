using corona.db;
using corona.Entities;
using corona.Helpers;
using corona.Repositories.Interfaces;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace corona.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(IDbContext context) : base(context)
        {
        }

        public Task<User> GetUser(string username, string password)
        {
            var builder = Builders<User>.Filter;
            var filter = builder.Eq(user => user.Username, username) & builder.Eq(user => user.Password, Hash.GenerateHash(password));
            return Collection.Find(filter).FirstOrDefaultAsync();

        }
    }
}