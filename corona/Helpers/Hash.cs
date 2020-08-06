using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace corona.Helpers
{
    public class Hash
    {

        private static readonly byte[] _salt = Encoding.UTF8.GetBytes("JuGxW5jzsQUsyYpEj8SyPA==");


        public static string GenerateHash(string password)
        {
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password,
                salt: _salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 1000,
                numBytesRequested: 256 / 8
           ));
        }

        //private static byte[] GenerateSalt(int bit)
        //{
        //    var salt = new byte[bit / 8];

        //    using (var rng = RandomNumberGenerator.Create())
        //    {
        //        rng.GetBytes(salt);
        //    }
        //    Console.WriteLine(Convert.ToBase64String(salt));
        //    return salt;

        //}
    }
}
