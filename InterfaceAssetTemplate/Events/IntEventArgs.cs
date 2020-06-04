using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterfaceAssetTemplate.Events
{
    public class IntEventArgs: EventArgs
    {
        public int IntValue { get; set; }

        public IntEventArgs(int i_)
        {
            this.IntValue = i_;
        }
    }
}
