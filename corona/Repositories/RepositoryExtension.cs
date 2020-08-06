using corona.Repositories.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace corona.Repositories
{
    public static class RepositoryExtension
    {
        public static void RegisterRepos(this IServiceCollection services)
        {
            services.AddSingleton<ICoronaRepository, CoronaRepository>();
            services.AddSingleton<IUserRepository, UserRepository>();
        }
    }
}
