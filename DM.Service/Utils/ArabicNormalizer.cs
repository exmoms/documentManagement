using System;
using System.Collections.Generic;
using System.Text;

namespace DM.Service.Utils
{
    public static class ArabicNormalizer
    {
        public static string Normalize(string input)
        {
            if (input == null)
                return null; 

            //Remove honorific sign
            input = input.Replace("\u0610", "");//ARABIC SIGN SALLALLAHOU ALAYHE WA SALLAM
            input = input.Replace("\u0611", "");//ARABIC SIGN ALAYHE ASSALLAM
            input = input.Replace("\u0612", "");//ARABIC SIGN RAHMATULLAH ALAYHE
            input = input.Replace("\u0613", "");//ARABIC SIGN RADI ALLAHOU ANHU
            input = input.Replace("\u0614", "");//ARABIC SIGN TAKHALLUS

            //Remove koranic anotation
            input = input.Replace("\u0615", "");//ARABIC SMALL HIGH TAH
            input = input.Replace("\u0616", "");//ARABIC SMALL HIGH LIGATURE ALEF WITH LAM WITH YEH
            input = input.Replace("\u0617", "");//ARABIC SMALL HIGH ZAIN
            input = input.Replace("\u0618", "");//ARABIC SMALL FATHA
            input = input.Replace("\u0619", "");//ARABIC SMALL DAMMA
            input = input.Replace("\u061A", "");//ARABIC SMALL KASRA
            input = input.Replace("\u06D6", "");//ARABIC SMALL HIGH LIGATURE SAD WITH LAM WITH ALEF MAKSURA
            input = input.Replace("\u06D7", "");//ARABIC SMALL HIGH LIGATURE QAF WITH LAM WITH ALEF MAKSURA
            input = input.Replace("\u06D8", "");//ARABIC SMALL HIGH MEEM INITIAL FORM
            input = input.Replace("\u06D9", "");//ARABIC SMALL HIGH LAM ALEF
            input = input.Replace("\u06DA", "");//ARABIC SMALL HIGH JEEM
            input = input.Replace("\u06DB", "");//ARABIC SMALL HIGH THREE DOTS
            input = input.Replace("\u06DC", "");//ARABIC SMALL HIGH SEEN
            input = input.Replace("\u06DD", "");//ARABIC END OF AYAH
            input = input.Replace("\u06DE", "");//ARABIC START OF RUB EL HIZB
            input = input.Replace("\u06DF", "");//ARABIC SMALL HIGH ROUNDED ZERO
            input = input.Replace("\u06E0", "");//ARABIC SMALL HIGH UPRIGHT RECTANGULAR ZERO
            input = input.Replace("\u06E1", "");//ARABIC SMALL HIGH DOTLESS HEAD OF KHAH
            input = input.Replace("\u06E2", "");//ARABIC SMALL HIGH MEEM ISOLATED FORM
            input = input.Replace("\u06E3", "");//ARABIC SMALL LOW SEEN
            input = input.Replace("\u06E4", "");//ARABIC SMALL HIGH MADDA
            input = input.Replace("\u06E5", "");//ARABIC SMALL WAW
            input = input.Replace("\u06E6", "");//ARABIC SMALL YEH
            input = input.Replace("\u06E7", "");//ARABIC SMALL HIGH YEH
            input = input.Replace("\u06E8", "");//ARABIC SMALL HIGH NOON
            input = input.Replace("\u06E9", "");//ARABIC PLACE OF SAJDAH
            input = input.Replace("\u06EA", "");//ARABIC EMPTY CENTRE LOW STOP
            input = input.Replace("\u06EB", "");//ARABIC EMPTY CENTRE HIGH STOP
            input = input.Replace("\u06EC", "");//ARABIC ROUNDED HIGH STOP WITH FILLED CENTRE
            input = input.Replace("\u06ED", "");//ARABIC SMALL LOW MEEM

            //Remove tatweel
            input = input.Replace("\u0640", "");

            //Remove tashkeel
            input = input.Replace("\u064B", "");//ARABIC FATHATAN
            input = input.Replace("\u064C", "");//ARABIC DAMMATAN
            input = input.Replace("\u064D", "");//ARABIC KASRATAN
            input = input.Replace("\u064E", "");//ARABIC FATHA
            input = input.Replace("\u064F", "");//ARABIC DAMMA
            input = input.Replace("\u0650", "");//ARABIC KASRA
            input = input.Replace("\u0651", "");//ARABIC SHADDA
            input = input.Replace("\u0652", "");//ARABIC SUKUN
            input = input.Replace("\u0653", "");//ARABIC MADDAH ABOVE
            input = input.Replace("\u0654", "");//ARABIC HAMZA ABOVE
            input = input.Replace("\u0655", "");//ARABIC HAMZA BELOW
            input = input.Replace("\u0656", "");//ARABIC SUBSCRIPT ALEF
            input = input.Replace("\u0657", "");//ARABIC INVERTED DAMMA
            input = input.Replace("\u0658", "");//ARABIC MARK NOON GHUNNA
            input = input.Replace("\u0659", "");//ARABIC ZWARAKAY
            input = input.Replace("\u065A", "");//ARABIC VOWEL SIGN SMALL V ABOVE
            input = input.Replace("\u065B", "");//ARABIC VOWEL SIGN INVERTED SMALL V ABOVE
            input = input.Replace("\u065C", "");//ARABIC VOWEL SIGN DOT BELOW
            input = input.Replace("\u065D", "");//ARABIC REVERSED DAMMA
            input = input.Replace("\u065E", "");//ARABIC FATHA WITH TWO DOTS
            input = input.Replace("\u065F", "");//ARABIC WAVY HAMZA BELOW
            input = input.Replace("\u0670", "");//ARABIC LETTER SUPERSCRIPT ALEF

            //Replace Waw Hamza Above by Waw
            input = input.Replace("\u0624", "\u0648");

            //Replace Ta Marbuta by Ha
            input = input.Replace("\u0629", "\u0647");

            //Replace Ya
            // and Ya Hamza Above by Alif Maksura
            input = input.Replace("\u064A", "\u0649");
            input = input.Replace("\u0626", "\u0649");

            // Replace Alifs with Hamza Above/Below
            // and with Madda Above by Alif
            input = input.Replace("\u0622", "\u0627");
            input = input.Replace("\u0623", "\u0627");
            input = input.Replace("\u0625", "\u0627");

            return input;
        }
    }
}
