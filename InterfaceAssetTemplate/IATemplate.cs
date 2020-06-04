using InterfaceAssetTemplate.Events;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterfaceAssetTemplate
{
    public class IATemplate : INotifyPropertyChanged
    {
        #region INotifyPropertyChanged


        public event PropertyChangedEventHandler PropertyChanged;


        private void NotifyPropertyChanged(String info)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(info));
            }
        }

        #endregion

        #region Enum

        public enum SimpleEnum
        {
            value1,
            value2
        }

        public enum AssignedEnum
        {
            val1 = 10,
            val2 = 20,
            val3 = 30
        }

        #endregion

        #region private attributes

        private int m_iAnIntProperty = 0;
        private string m_strAStringProperty = "";
        private string m_strMessage = "";
        private SimpleEnum m_eSimpleEnumProperty;
        private AssignedEnum m_eAssignedEnumProperty;

        #endregion

        #region public properties

        public int AnIntProperty
        {
            get { return m_iAnIntProperty; }
            set
            {
                if (m_iAnIntProperty != value)
                {
                    m_iAnIntProperty = value;
                    NotifyPropertyChanged("AnIntProperty");
                }
            }
        }

        public string AStringProperty
        {
            get { return m_strAStringProperty; }
            set
            {
                if (m_strAStringProperty != value)
                {
                    m_strAStringProperty = value;
                    NotifyPropertyChanged("AStringProperty");
                }
            }
        }

        public string Message
        {
            get { return m_strMessage; }
            set
            {
                if (m_strMessage != value)
                {
                    m_strMessage = value;
                    NotifyPropertyChanged("Message");
                }
            }
        }

        public SimpleEnum ASimpleEnumProperty
        {
            get { return m_eSimpleEnumProperty; }
            set
            {
                if (m_eSimpleEnumProperty != value)
                {
                    m_eSimpleEnumProperty = value;
                    NotifyPropertyChanged("ASimpleEnumProperty");
                }
            }
        }

        public AssignedEnum AnAssignedEnumProperty
        {
            get { return m_eAssignedEnumProperty; }
            set
            {
                if (m_eAssignedEnumProperty != value)
                {
                    m_eAssignedEnumProperty = value;
                    NotifyPropertyChanged("AnAssignedEnumProperty");
                }
            }
        }

        #endregion

        #region events

        public event EventHandler SimpleEventNoParameter;

        public delegate void IntEventHandler(object sender, IntEventArgs args);
        public event IntEventHandler EventWithIntParameter;

        public delegate void ObjectsEventHandler(object sender, ObjectEventArgs args);
        public event ObjectsEventHandler EventWithObjectParameter;

        public delegate void EnumEventHandler(object sender, EnumEventArgs args);
        public event EnumEventHandler EventWithEnumParameters;

        #endregion

        #region Constructor

        public IATemplate()
        {
            //required even if nothing has to be done here. 

            //initialize objects such as collections
            m_eSimpleEnumProperty = SimpleEnum.value1;
            m_eAssignedEnumProperty = AssignedEnum.val1;
        }

        #endregion

        #region public methods

        public void methodNoParameter()
        {
            //do something

            //display a message
            Message = "methodNoParameter called";

            //raise an event / trigger
            if (SimpleEventNoParameter != null)
                SimpleEventNoParameter(this, null);
        }

        public void methodIntParameter(int i_)
        {
            //do something
            AnIntProperty = i_;

            //display a message
            Message = "methodIntParameter called with parameter: " + i_;

            //raise an event / trigger
            if (EventWithIntParameter != null)
                EventWithIntParameter(this, new IntEventArgs(i_));
        }

        public void methodMultipleStringParameters(string s1_, string s2_)
        {
            //do something
            AStringProperty = s1_ + " + " + s2_;

            //display a message
            Message = "methodMultipleStringParameters called with parameters: " + s1_ + " AND " + s2_;

            //raise an event / trigger
            if (EventWithObjectParameter != null)
                EventWithObjectParameter(this, new ObjectEventArgs()
                {
                    String1 = s1_,
                    String2 = s2_
                });
        }

        public void methodEnumParamter(SimpleEnum e1_, AssignedEnum e2_)
        {
            //do something
            ASimpleEnumProperty = e1_;
            AnAssignedEnumProperty = e2_;

            //display a message
            Message = "methodEnumParamter called with parameters: " + e1_ + " AND " + e2_;

            //raise an event / trigger
            if (EventWithEnumParameters != null)
                EventWithEnumParameters(this, new EnumEventArgs()
                {
                    Enum1 = e1_,
                    Enum2 = e2_
                });
        }

        #endregion
    }
}
