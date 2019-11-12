-- CADP (CONSTRUCTION AND ANALYSIS OF DISTRIBUTED PROCESSES)
-- http://cadp.inria.fr

This directory contains data types libraries to be used with LOTOS,
FSP, and LNT.

1) The official version of LOTOS library is given in file 
   ``ISO8807.lib''. It won't work with CADP as it makes use
   of non-formal sort and operation actualization, which are
   not supported by CAESAR and CAESAR.ADT, and will probably
   never be. Thanks are due to Pippo Scollo and Rudie Alderden
   for identifying the problem.

2) However, the type definitions of ISO8807.lib are available
   for use with CADP as separate ``.lib'' files listed below.
   Most types in the standard library have been modified in order
   to be accepted by CAESAR and CAESAR.ADT. We indicate the most
   useful files with a ``+'' symbol; the other types are rarely
   used in practice:

        BASICNATURALNUMBER.lib
      + BIT.lib
        BITNATREPR.lib
        BITSTRING.lib
      + BOOLEAN.lib
        DECDIGIT.lib
        DECNATREPR.lib
        DECSTRING.lib
        HEXDIGIT.lib
        HEXNATREPR.lib
        HEXSTRING.lib
        NATREPRESENTATIONS.lib
      + NATURALNUMBER.lib
        OCTDIGIT.lib
        OCTET.lib
        OCTETSTRING.lib
        OCTNATREPR.lib
        OCTSTRING.lib

3) An extended definition  of natural numbers (richer than the
   international standard definition) is given in file NATURAL.lib.
   Notice that natural numbers are split into three files:
        BASICNATURALNUMBER.lib
        NATURALNUMBER.lib
        NATURAL.lib
   This is justified by legacy and backward compatibility
   reasons. The two former types are those defined in the LOTOS
   international standard, the latter one contains practically
   useful extensions.

4) Integer numbers are not defined in the LOTOS international
   standard, but a definition is provided for use with CADP. For
   symmetry with natural numbers, integer numbers are split into
   two files:
        INTEGERNUMBER.lib
        INTEGER.lib

5) Also, some types deserve an ``external'' implementation, either
   because a hand-written implementation in C can be more efficient 
   (e.g., arithmetical operations) or because they are not easily 
   described in LOTOS (e.g., real numbers, character strings, ...)
   These types are available in the ``X_*.lib'' files (where ``X''
   stands for ``eXternal''):
        X_ACTION.lib
        X_BIT.lib
        X_BOOLEAN.lib
        X_CHARACTER.lib
        X_INTEGER.lib
        X_NATURAL.lib
        X_REAL.lib
        X_STRING.lib
   The C implementation corresponding to these types can be found
   in the ``X_*.h'' files contained in the ``$CADP/incl'' directory.

6) The two files:
        FSP_V1.lib
        LNT_V1.lib
   provide data type definitions to be used with the FSP and LNT
   languages, respectively. The corresponding implementations are
   given in the FSP_V1.h and LNT_V1.h files contained in the
   ``$CADP/incl'' directory.

7) The files
        BIT.lnt
        OCTET.lnt
        OCTVALUES.lnt
   provide data type definitions that can be imported in LNT modules.

Finally, notice that other examples of LOTOS abstract data types
(lists, arrays, etc.) are given in directory $CADP/demos/archive/lib.


